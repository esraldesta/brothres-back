import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { getDateInfo, getTimeDifference } from './utils';
import { START_DATE } from './shared/constants';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  //! refractor the method and calculate at some interval
  async getStat(key: string): Promise<{
    monthly: number;
    weekly: number;
    daily: number;
    hourly: number;
    monthlyAverage: number;
    weeklyAverage: number;
    dailyAverage: number;
    hourlyAverage: number;
  }> {
    const total = await this.prisma.userActivity.count({
      where: {
        trackKey: key,
      },
    });

    if (!total) {
      return {
        monthly: 0,
        weekly: 0,
        daily: 0,
        hourly: 0,
        monthlyAverage: 0,
        weeklyAverage: 0,
        dailyAverage: 0,
        hourlyAverage: 0,
      };
    }
    const {
      monthStart,
      monthFinish,
      weekStart,
      weekFinish,
      hourStart,
      hourFinish,
      today,
    } = getDateInfo();

    const { months, weeks, days, hours } = getTimeDifference(START_DATE);

    const monthly = await this.prisma.userActivity.count({
      where: {
        trackKey: key,
        createdAt: {
          gte: monthStart,
          lte: monthFinish,
        },
      },
    });

    const weekly = await this.prisma.userActivity.count({
      where: {
        trackKey: key,
        createdAt: {
          gte: weekStart,
          lte: weekFinish,
        },
      },
    });

    const hourly = await this.prisma.userActivity.count({
      where: {
        trackKey: key,
        createdAt: {
          gte: hourStart,
          lte: hourFinish,
        },
      },
    });

    const daily = await this.prisma.userActivity.count({
      where: {
        trackKey: key,
        date: today,
      },
    });

    console.log(total, months);

    return {
      monthly,
      weekly,
      daily,
      hourly,
      monthlyAverage: Math.round(total / months),
      weeklyAverage: Math.round(total / weeks),
      dailyAverage: Math.round(total / days),
      hourlyAverage: Math.round(total / hours),
    };
  }
}
