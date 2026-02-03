import { ChangeSeats } from './change-seats';
import { InMemoryWebinarRepository } from '../adapters/webinar-repository.in-memory';
import { testUser } from '../../users/tests/user-seeds';

type ChangeSeatsPayload = {
  user: typeof testUser.alice;
  webinarId: string;
  seats: number;
};

export async function whenUserChangeSeatsWith(
  useCase: ChangeSeats,
  payload: ChangeSeatsPayload,
) {
  await useCase.execute(payload);
}

export async function whenUserChangeSeatsShouldFailWith(
  useCase: ChangeSeats,
  payload: ChangeSeatsPayload,
  message: string,
) {
  await expect(useCase.execute(payload)).rejects.toThrow(message);
}

export async function thenUpdatedWebinarSeatsShouldBe(
  webinarRepository: InMemoryWebinarRepository,
  seats: number,
) {
  const updatedWebinar = await webinarRepository.findById('webinar-id');
  expect(updatedWebinar?.props.seats).toEqual(seats);
}

export function expectWebinarToRemainUnchanged(
  webinarRepository: InMemoryWebinarRepository,
) {
  const currentWebinar = webinarRepository.findByIdSync('webinar-id');
  expect(currentWebinar?.props.seats).toEqual(100);
}
