from django.contrib import admin
from .models import SchoolClass, Subject, Lecture, Stream, StudentProfile, StudyMaterial

admin.site.register(SchoolClass)
admin.site.register(Subject)
admin.site.register(Lecture)
admin.site.register(Stream)
@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "student_class",
        "stream",
        "phone",
        "created_at",
    )

admin.site.register(StudyMaterial)
