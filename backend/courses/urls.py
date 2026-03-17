from django.urls import path

from .views import (
    ClassDetailAPIView,
    StudentRegisterAPIView,
    StudentLoginAPIView,
    StudentProfileAPIView,
    StudyMaterialDeleteAPIView


)

urlpatterns = [
    path("class/<int:class_id>/", ClassDetailAPIView.as_view()),
    path("register/", StudentRegisterAPIView.as_view()),
    path("login/", StudentLoginAPIView.as_view()),
    path("profile/", StudentProfileAPIView.as_view()),
    
]

# from .views import StudyMaterialUploadAPIView
# from .views import StudyMaterialListAPIView
# from .views import ChangePasswordAPIView
# from .views import LectureCreateAPIView
# from .views import LectureDeleteAPIView
from .views import (
    StudyMaterialUploadAPIView,
    StudyMaterialListAPIView,
    ChangePasswordAPIView,
    LectureCreateAPIView,
    LectureDeleteAPIView,
    LectureListAPIView,
)

urlpatterns += [
    path("materials/upload/", StudyMaterialUploadAPIView.as_view()),
    path("materials/", StudyMaterialListAPIView.as_view()),
    path("materials/<int:pk>/", StudyMaterialDeleteAPIView.as_view()),
    path("change-password/", ChangePasswordAPIView.as_view()),
    path("lecture/create/", LectureCreateAPIView.as_view()),
    path("lecture/delete/<int:pk>/", LectureDeleteAPIView.as_view()),
    path("lecture/list/", LectureListAPIView.as_view()),



]


