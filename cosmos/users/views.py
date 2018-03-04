from django.views.generic import CreateView, DetailView, RedirectView, View
from django.http import Http404
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import login
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.core.urlresolvers import reverse


class SignUpView(CreateView):

    """
    create a new user
    """

    template_name = 'users/signup.html'
    model = User
    form_class = UserCreationForm
    success_url = '/'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated():
            return redirect('profile', username=request.user.username)
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        form.save()
        username = self.request.POST['username']
        password = self.request.POST['password1']
        # log the user in when they signup
        user = authenticate(username=username, password=password)
        auth_login(self.request, user)
        # and redirect to their profile
        return redirect('profile', username=username)


class LoginView(View):

    """
    redirects the user to their profile if already logged in, otherwise loads
    /login page
    """

    template_name = "users/login.html"

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated():
            return redirect('profile', username=request.user.username)
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, **kwargs):
        return login(request, template_name=self.template_name, **kwargs)

    def post(self, request, **kwargs):
        return login(request, template_name=self.template_name, **kwargs)


class ProfileView(LoginRequiredMixin, DetailView):

    template_name = 'users/profile.html'
    model = User

    def get_object(self):
        obj = User.objects.get(username=self.kwargs.get('username'))
        if obj != self.request.user:
            raise Http404
        return obj


class BaseProfileView(LoginRequiredMixin, RedirectView):

    """
    This base profile view is used to redirect from the /profile url
    to a /profile/<username> url.
    """
    permanent = False

    def get_redirect_url(self):
        return reverse('profile', kwargs={'username': self.request.user.username})
