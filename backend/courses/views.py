from rest_framework.views import APIView
from rest_framework.response import Response
from .models import SchoolClass
from .serializers import SchoolClassSerializer

from rest_framework import status
from .serializers import StudentRegistrationSerializer

from .serializers import StudentLoginSerializer

from rest_framework.permissions import IsAuthenticated
from .serializers import StudentProfileSerializer

from rest_framework import permissions



class ClassDetailAPIView(APIView):
    def get(self, request, class_id):
        school_class = SchoolClass.objects.get(id=class_id)
        serializer = SchoolClassSerializer(school_class)
        return Response(serializer.data)

#registration

class StudentRegisterAPIView(APIView):
    def post(self, request):
        serializer = StudentRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.save()   # calls create()
        return Response(data, status=status.HTTP_201_CREATED)
#login

class StudentLoginAPIView(APIView):
    """
    API endpoint for student login
    """

    def post(self, request):
        serializer = StudentLoginSerializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from django.shortcuts import get_object_or_404
from .models import StudentProfile

class StudentProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(
            StudentProfile,
            user=request.user
        )
        serializer = StudentProfileSerializer(profile)
        return Response(serializer.data)

from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import StudyMaterial
from .serializers import StudyMaterialSerializer


# ---------------------------------------------------
# 🔐 Custom permission: Only teachers can upload/delete
# ---------------------------------------------------
class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff


class StudyMaterialUploadAPIView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        # Only teachers allowed
        
        if not request.user.is_staff:
            return Response(
                {"error": "Only teachers can upload materials."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = StudyMaterialSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(uploaded_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated


class StudyMaterialListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudyMaterialSerializer

    def get_queryset(self):
        queryset = StudyMaterial.objects.all()

        school_class = self.request.query_params.get("class")
        stream = self.request.query_params.get("stream")
        subject = self.request.query_params.get("subject")

        if school_class:
            queryset = queryset.filter(school_class_id=school_class)

        if stream:
            queryset = queryset.filter(stream_id=stream)

        if subject:
            queryset = queryset.filter(subject_id=subject)

        return queryset.order_by("-created_at")


from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

class StudyMaterialDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def delete(self, request, pk):
        # find material
        material = get_object_or_404(StudyMaterial, pk=pk)

        # optional: only allow teacher to delete their own upload
        if material.uploaded_by != request.user:
            return Response(
                {"detail": "Not allowed."},
                status=403
            )

        material.delete()
        return Response(status=204)

from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.password_validation import validate_password


class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        # check old password
        if not user.check_password(old_password):
            return Response(
                {"error": "Old password is incorrect"},
                status=400,
            )

        # validate new password
        try:
            validate_password(new_password, user)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=400,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password changed successfully"}
        )


from rest_framework.permissions import IsAdminUser
from .models import Lecture
from .serializers import LectureSerializer


from rest_framework.permissions import IsAdminUser
from .models import Lecture
from .serializers import LectureSerializer


class LectureCreateAPIView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request):

        serializer = LectureSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

from rest_framework.permissions import IsAdminUser
from .models import Lecture
from rest_framework.views import APIView
from rest_framework.response import Response


# teacher delete lecture
class LectureDeleteAPIView(APIView):

    permission_classes = [IsAdminUser]

    def delete(self, request, pk):

        try:
            lecture = Lecture.objects.get(id=pk)
            lecture.delete()
            return Response({"message": "deleted"})

        except Lecture.DoesNotExist:
            return Response({"error": "not found"}, status=404)

from .models import Lecture
from .serializers import LectureSerializer
from rest_framework.permissions import IsAdminUser


# list all lectures (teacher)
class LectureListAPIView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        lectures = Lecture.objects.all().order_by("-id")

        serializer = LectureSerializer(
            lectures,
            many=True
        )

        return Response(serializer.data)