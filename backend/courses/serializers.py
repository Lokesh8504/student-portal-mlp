from rest_framework import serializers
from .models import SchoolClass, Stream, Subject, Lecture, StudentProfile
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from django.contrib.auth import authenticate



class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = ["id", "title", "video_url" , "subject"]


class SubjectSerializer(serializers.ModelSerializer):
    lectures = LectureSerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = ["id", "name", "lectures"]


class StreamSerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, read_only=True)

    class Meta:
        model = Stream
        fields = ["id", "name", "subjects"]


class SchoolClassSerializer(serializers.ModelSerializer):
    # 🔑 THIS IS THE IMPORTANT FIX
    streams = StreamSerializer(many=True, read_only=True)

    class Meta:
        model = SchoolClass
        fields = ["id", "name", "streams"]

#Student-Profile

class StudentRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    stream = serializers.ChoiceField(
        choices=[
            ("science-maths", "Science (Maths)"),
            ("science-bio", "Science (Biology)"),
            ("commerce", "Commerce"),
            ("arts", "Arts"),
        ],
        required=False,
        allow_null=True,
        allow_blank=True,
    )

    phone = serializers.CharField(
        max_length=15,
        required=False,
        allow_blank=True,
    )

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

    def create(self, validated_data):
        # Create user
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
    
        # Get auto-created profile (created by signal)
        profile = StudentProfile.objects.get(user=user)
    
        # Update optional fields if provided
        profile.stream = validated_data.get("stream")
        profile.phone = validated_data.get("phone", "")
        profile.save()
    
        # Create auth token
        token = Token.objects.create(user=user)
    
        return {
            "token": token.key,
            "username": user.username,
            "email": user.email,
        }





class StudentLoginSerializer(serializers.Serializer):
    """
    Handles student login using username + password
    """

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data.get("username"),
            password=data.get("password"),
        )

        if not user:
            raise serializers.ValidationError("Invalid username or password")

        token, _ = Token.objects.get_or_create(user=user)

        return {
            "token": token.key,
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
        }

from .models import StudentProfile

class StudentProfileSerializer(serializers.ModelSerializer):
    """
    Returns logged-in student's profile data
    """

    username = serializers.CharField(source="user.username")
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = StudentProfile
        fields = [
            "username",
            "email",
            "phone",
            "student_class",
            "stream",
        ]

from .models import StudyMaterial


class StudyMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyMaterial
        fields = [
            "id",
            "title",
            "material_type",
            "file",
            "video_url",
            "school_class",
            "stream",
            "subject",
            "created_at",
        ]
        read_only_fields = ["created_at"]
