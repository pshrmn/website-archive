from django.test import TestCase
from django.contrib.auth.models import User
from django.db.utils import DataError, IntegrityError

from system.models import PlanetarySystem, Star, Planet, Moon


class PlanetarySystemTestCase(TestCase):

    def test_create(self):
        creator = User.objects.create(
            username='tester',
            password='badpassword'
        )

        one = PlanetarySystem.objects.create(name='one', creator=creator)
        two = PlanetarySystem.objects.create(name='two', public=False)

        self.assertIsInstance(one, PlanetarySystem)
        self.assertIsInstance(two, PlanetarySystem)

        self.assertEqual(one.creator, creator)
        self.assertEqual(two.creator, None)

        self.assertTrue(one.public)
        self.assertFalse(two.public)

    def test_unique(self):
        duplicator = User.objects.create(
            username='duplicator',
            password='duplicator'
        )
        first = PlanetarySystem.objects.create(name='duplicator', creator=duplicator)
        self.assertIsInstance(first, PlanetarySystem)
        with self.assertRaises(IntegrityError):
            PlanetarySystem.objects.create(name='duplicator', creator=duplicator)

    def test_url_name(self):
        has_spaces = PlanetarySystem.objects.create(name='Test System')
        self.assertEqual(has_spaces.url_name(), 'Test+System')
        no_spaces = PlanetarySystem.objects.create(name='TestSystem')
        self.assertEqual(no_spaces.url_name(), 'TestSystem')

    def test_str(self):
        ps = PlanetarySystem.objects.create(name='Planets')
        self.assertEqual(str(ps), '{} - {}'.format(ps.pk, ps.name))

    def test_to_json(self):
        ps = PlanetarySystem.objects.create(name='Planets')
        pjs = ps.to_json()
        self.assertIsInstance(pjs, dict)
        self.assertEqual(pjs['name'], ps.name)
        self.assertIsInstance(pjs['planets'], list)
        self.assertIsNone(pjs['star'])


class StarTestCase(TestCase):

    def make_star(self, name, spectrum='G', subspectrum=2, creator=None, system=None):
        if creator is None:
            creator = User.objects.create(
                username='creator',
                password='badpassword'
            )
        if system is None:
            system = PlanetarySystem.objects.create(name='Solar System', creator=creator)
        return Star.objects.create(
            name=name,
            spectrum=spectrum,
            subspectrum=subspectrum,
            planetarysystem=system,
            creator=creator
        )

    def test_create(self):
        star = self.make_star(name='Star2D2')
        self.assertIsInstance(star, Star)

    def test_str(self):
        star = self.make_star(name='Death Star')
        self.assertEqual(str(star), '{} - {}'.format(star.pk, star.name))

    def test_to_json(self):
        star = self.make_star(name='Death Star', spectrum='O', subspectrum=3)
        star_json = star.to_json()
        rows = [
            ('name', str),
            ('spectrum', str),
            ('subspectrum', int)
        ]
        for row in rows:
            key, val_type = row
            self.assertIn(key, star_json)
            self.assertIsInstance(star_json[key], val_type)


class PlanetTestCase(TestCase):

    def make_planet(self, name, radius=10, distance=10,
                    day_length=10, orbit=10.0, creator=None, system=None):
        if creator is None:
            creator = User.objects.create(
                username='creator',
                password='badpassword'
            )
        if system is None:
            system = PlanetarySystem.objects.create(name='Solar System', creator=creator)
        return Planet.objects.create(
            name=name,
            radius=radius,
            distance=distance,
            day_length=day_length,
            orbit=orbit,
            planetarysystem=system,
            creator=creator
        )

    def test_create(self):
        mercury = self.make_planet('Mercury')
        self.assertIsInstance(mercury, Planet)

    def test_str(self):
        neptune = self.make_planet('Neptune')
        self.assertEqual(str(neptune), '{} - {}'.format(neptune.pk, neptune.name))

    def test_url_name(self):
        earth = self.make_planet('The Blue Planet')
        self.assertEqual(earth.url_name(), 'The+Blue+Planet')

    def test_unique(self):
        creator = User.objects.create(
            username='creator',
            password='badpassword'
        )
        system = PlanetarySystem.objects.create(name='The Solar System', creator=creator)
        jupiter = self.make_planet('Jupiter', system=system, creator=creator)
        self.assertIsInstance(jupiter, Planet)
        with self.assertRaises(IntegrityError):
            self.make_planet('Jupiter', system=system, creator=creator)

    def test_to_json(self):
        planet = self.make_planet('Venus')
        planet_json = planet.to_json()
        self.assertIsInstance(planet_json, dict)
        rows = [
            ('name', str),
            ('radius', int),
            ('distance', int),
            ('day_length', int),
            ('orbit', float),
        ]
        for row in rows:
            key, val_type = row
            self.assertIn(key, planet_json)
            self.assertIsInstance(planet_json[key], val_type)


class MoonTestCase(TestCase):

    def make_moon(self, name, radius=10, distance=10,
                  day_length=10, orbit=10.0, creator=None, system=None, planet=None):
        if creator is None:
            creator = User.objects.create(
                username='creator',
                password='badpassword'
            )
        if system is None:
            system = PlanetarySystem.objects.create(name='Solar System', creator=creator)
        if planet is None:
            planet = Planet.objects.create(
                name='Saturn',
                radius=10,
                distance=10,
                day_length=10,
                orbit=10,
                planetarysystem=system,
                creator=creator
            )
        return Moon.objects.create(
            name=name,
            radius=radius,
            distance=distance,
            day_length=day_length,
            orbit=orbit,
            planet=planet,
            creator=creator
        )

    def test_create(self):
        luna = self.make_moon('Luna')
        self.assertIsInstance(luna, Moon)

    def test_str(self):
        luna = self.make_moon('Luna')
        self.assertEqual(str(luna), '{} - {}'.format(luna.pk, luna.name))

    def test_unique(self):
        duplicator = User.objects.create(
            username='duplicator',
            password='duplicator'
        )
        system = PlanetarySystem.objects.create(
            name='ditto',
            creator=duplicator
        )
        planet = Planet.objects.create(
            name='ditto',
            radius=10,
            distance=10,
            day_length=10,
            orbit=10,
            planetarysystem=system,
            creator=duplicator
        )
        first = self.make_moon('ditto', creator=duplicator, system=system, planet=planet)
        self.assertIsInstance(first, Moon)
        with self.assertRaises(IntegrityError):
            self.make_moon('ditto', creator=duplicator, system=system, planet=planet)

    def test_to_json(self):
        moon = self.make_moon('The Moon')
        moon_json = moon.to_json()
        self.assertIsInstance(moon_json, dict)
        rows = [
            ('name', str),
            ('radius', int),
            ('distance', int),
            ('day_length', int),
            ('orbit', float),
        ]
        for row in rows:
            key, val_type = row
            self.assertIn(key, moon_json)
            self.assertIsInstance(moon_json[key], val_type)
