import math


def haversine(start, end):
    # radius of earth in miles
    R = 3963.1676
    start_lat = math.radians(start.latitude)
    start_cos = math.cos(start_lat)

    end_lat = math.radians(end.latitude)
    end_cos = math.cos(end_lat)

    lat_delta = math.radians(end.latitude - start.latitude)
    lat_delta_sin = math.sin(lat_delta/2)**2

    long_delta = math.radians(end.longitude - start.longitude)
    long_delta_sin = math.sin(long_delta/2)**2

    a = lat_delta_sin + (start_cos * end_cos * long_delta_sin)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R*c
