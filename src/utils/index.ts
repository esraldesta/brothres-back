import { plainToInstance, ClassConstructor } from 'class-transformer';

export function transformToDto<T, V>(cls: ClassConstructor<T>, plain: V): T {
  return plainToInstance(cls, plain, { excludeExtraneousValues: true });
}

export function getDateInfo(): {
  monthStart: Date;
  monthFinish: Date;
  weekStart: Date;
  weekFinish: Date;
  hourStart: Date;
  hourFinish: Date;
  today: string;
} {
  const now = new Date();

  // Current month start and finish date
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthFinish = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Current week start and finish date (assuming Sunday as the start of the week)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekFinish = new Date(weekStart);
  weekFinish.setDate(weekStart.getDate() + 6);
  weekFinish.setHours(23, 59, 59, 999);

  // Current hour start and finish
  const hourStart = new Date(now);
  hourStart.setMinutes(0, 0, 0); // Start of the hour

  const hourFinish = new Date(now);
  hourFinish.setMinutes(59, 59, 999); // End of the hour

  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return {
    monthStart,
    monthFinish,
    weekStart,
    weekFinish,
    hourStart,
    hourFinish,
    today,
  };
}

export function getTimeDifference(date: Date): {
  months: number;
  weeks: number;
  days: number;
  hours: number;
} {
  const now = new Date();

  const timeDifference = now.getTime() - date.getTime();
  const hours = timeDifference / (1000 * 3600);

  const days = timeDifference / (1000 * 3600 * 24);

  const weeks = days / 7;

  const months = days / 30.44;

  return {
    months,
    weeks,
    days,
    hours,
  };
}
