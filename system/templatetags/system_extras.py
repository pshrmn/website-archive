from django import template

register = template.Library()


def pretty_time(total_seconds):
    hours, rest = divmod(total_seconds, 60*60)
    minutes, seconds = divmod(rest, 60)
    times = []
    if hours != 0:
        times.append('%d hours' % hours)
    if minutes != 0 or len(times) != 0:
        times.append('%d minutes' % minutes)
    if seconds != 0:
        times.append('%d seconds' % seconds)
    return ' '.join(times)

register.filter('pretty_time', pretty_time)
