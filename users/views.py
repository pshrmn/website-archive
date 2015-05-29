"""
These views are wrappers so that I can add behavior based on if the user is
logged in or not
"""
from django.views.generic import TemplateView, View
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.contrib.auth.views import login, logout, password_change, \
    password_reset


User = get_user_model()


class LoginView(View):

    """
    redirects the user to the homepage if already logged in, otherwise loads
    /login page
    """

    def get(self, *args, **kwargs):
        if self.request.user.is_authenticated():
            return redirect("home")
        next_page = self.request.GET.get("next", '/')
        return login(extra_context={"next": next_page}, *args, **kwargs)

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
        return logout(next_page="/", *args, **kwargs)

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


class PasswordResetView(TemplateView):

    def get(self, *args, **kwargs):
        if self.request.user.is_authenticated():
            return redirect("home")
        return password_reset(*args, **kwargs)

    def post(self, *args, **kwargs):
        return password_reset(*args, **kwargs)
