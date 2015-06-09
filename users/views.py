"""
These views are wrappers so that I can add behavior based on if the user is
logged in or not
"""
from django.views.generic import TemplateView, View, CreateView
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.contrib.auth.views import login, logout, password_change
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login as auth_login

User = get_user_model()


class SignUpView(CreateView):

    """
    create a new user
    """

    template_name = "users/signup.html"
    model = User
    form_class = UserCreationForm
    success_url = '/'

    def form_valid(self, form):
        valid = super().form_valid(form)
        if not valid:
            return valid
        form.save()
        username = self.request.POST['username']
        password = self.request.POST['password1']
        user = authenticate(username=username, password=password)
        auth_login(self.request, user)
        return valid


class LoginView(View):

    """
    redirects the user to the homepage if already logged in, otherwise loads
    /login page
    """

    def get(self, *args, **kwargs):
        if self.request.user.is_authenticated():
            return redirect("home")
        next_page = self.request.GET.get("next", '/')
        return login(template_name="users/login.html",
                     extra_context={"next": next_page}, *args, **kwargs)

    def post(self, *args, **kwargs):
        return login(*args, **kwargs)


class LogoutView(View):

    """
    redirects the user to the homepage if already logged in, otherwise loads
    /login page
    """
    next_page = "/"

    def get(self, *args, **kwargs):
        if not self.request.user.is_authenticated():
            return redirect("home")
        return logout(template_name="users/logout.html", next_page="/",
                      *args, **kwargs)

    def post(self, *args, **kwargs):
        return logout(next_page="/", *args, **kwargs)


class PasswordChangeView(TemplateView):

    def get(self, *args, **kwargs):
        if not self.request.user.is_authenticated():
            return redirect("home")
        return password_change(post_change_redirect="/",
                               *args, **kwargs)

    def post(self, *args, **kwargs):
        return password_change(post_change_redirect="/",
                               *args, **kwargs)
