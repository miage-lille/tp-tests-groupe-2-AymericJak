// Tests unitaires

import { testUser } from '../../users/tests/user-seeds';
import { ChangeSeats } from './change-seats';
import { InMemoryWebinarRepository } from '../adapters/webinar-repository.in-memory';
import { Webinar } from '../entities/webinar.entity';
import {
  expectWebinarToRemainUnchanged,
  thenUpdatedWebinarSeatsShouldBe,
  whenUserChangeSeatsShouldFailWith,
  whenUserChangeSeatsWith,
} from './change-seats.fixtures';

describe('Feature : Change seats', () => {
  // Initialisation de nos tests, boilerplates...
  let webinarRepository: InMemoryWebinarRepository;
  let useCase: ChangeSeats;

  const webinar = new Webinar({
    id: 'webinar-id',
    organizerId: testUser.alice.props.id,
    title: 'Webinar title',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-01-01T01:00:00Z'),
    seats: 100,
  });

  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    useCase = new ChangeSeats(webinarRepository);
  });

  describe('Scenario: Happy path', () => {
    // Code commun à notre scénario : payload...
    const payload = {
      user: testUser.alice,
      webinarId: 'webinar-id',
      seats: 200,
    };

    it('should change the number of seats for a webinar', async () => {
      // ACT
      await whenUserChangeSeatsWith(useCase, payload);
      // ASSERT
      await thenUpdatedWebinarSeatsShouldBe(webinarRepository, 200);
    });
  });

  describe('Scenario: webinar does not exist', () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'missing-webinar-id',
      seats: 200,
    };
    it('should fail', async () => {
      await whenUserChangeSeatsShouldFailWith(
        useCase,
        payload,
        'Webinar not found',
      );

      expectWebinarToRemainUnchanged(webinarRepository);
    });
  });

  describe('Scenario: update the webinar of someone else', () => {
    const payload = {
      user: testUser.bob,
      webinarId: 'webinar-id',
      seats: 200,
    };

    it('should fail', async () => {
      await whenUserChangeSeatsShouldFailWith(
        useCase,
        payload,
        'User is not allowed to update this webinar',
      );

      expectWebinarToRemainUnchanged(webinarRepository);
    });
  });

  describe('Scenario: change seat to an inferior number', () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'webinar-id',
      seats: 50,
    };

    it('should fail', async () => {
      await whenUserChangeSeatsShouldFailWith(
        useCase,
        payload,
        'You cannot reduce the number of seats',
      );

      expectWebinarToRemainUnchanged(webinarRepository);
    });
  });

  describe('Scenario: change seat to a number > 1000', () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'webinar-id',
      seats: 1001,
    };

    it('should fail', async () => {
      await whenUserChangeSeatsShouldFailWith(
        useCase,
        payload,
        'Webinar must have at most 1000 seats',
      );

      expectWebinarToRemainUnchanged(webinarRepository);
    });
  });
});
