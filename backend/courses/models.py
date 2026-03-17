from django.db import models
from django.conf import settings


class SchoolClass(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


# NEW: Stream model (Science Maths, Science Bio, Arts)
class Stream(models.Model):
    name = models.CharField(max_length=100)
    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.CASCADE,
        related_name="streams"
    )

    def __str__(self):
        return f"{self.school_class.name} - {self.name}"


class Subject(models.Model):
    name = models.CharField(max_length=100)

    # subject now belongs to a stream (not directly to class)
    stream = models.ForeignKey(
        Stream,
        on_delete=models.CASCADE,
        related_name="subjects",
        null=True,        # allow temporarily
        blank=True

    )

    def __str__(self):
        return self.name


class Lecture(models.Model):
    title = models.CharField(max_length=200)
    video_url = models.URLField()

    # lecture belongs to a subject
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="lectures"
    )

    def __str__(self):
        return self.title
    
class StudentProfile(models.Model):
    """
    Stores student-specific information.
    Login-related data stays in Django's User model.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile"
    )

    # Academic information
    student_class = models.CharField(
        max_length=20,
        default="Class 12"
    )

    stream = models.CharField(
        max_length=50,
        choices=[
            ("science-maths", "Science (Maths)"),
            ("science-bio", "Science (Biology)"),
            ("commerce", "Commerce"),
            ("arts", "Arts"),
        ]
    )

    # Contact information
    phone = models.CharField(
        max_length=15,
        help_text="Student phone number"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.student_class})"


from django.contrib.auth.models import User

class StudyMaterial(models.Model):
    MATERIAL_TYPES = (
        ("notes", "Notes"),
        ("sample", "Sample Paper"),
        ("pyq", "Previous Year Paper"),
        ("video", "Video Lecture"),
    )

    title = models.CharField(max_length=255)

    material_type = models.CharField(
        max_length=20,
        choices=MATERIAL_TYPES
    )

    # File for notes / papers
    file = models.FileField(
        upload_to="study_materials/",
        blank=True,
        null=True
    )

    # For video lectures
    video_url = models.URLField(
        blank=True,
        null=True
    )

    # Hierarchy (Option B)
    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.CASCADE
    )

    stream = models.ForeignKey(
        Stream,
        on_delete=models.CASCADE
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE
    )

    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.material_type})"
