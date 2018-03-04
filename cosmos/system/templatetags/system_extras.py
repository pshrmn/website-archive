from django import template
import json

register = template.Library()


@register.filter(is_safe=True)
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


@register.filter()
def dump(json_dict):
    return json.dumps(json_dict)
