import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getAllRestaurantsOutput } from './dtos/all-restaurants.dto';
import { Restaurant } from './entities/restaurants.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}
  async getAllRestaurants(): Promise<getAllRestaurantsOutput> {
    try {
      const [
        restaurants,
        counts,
      ] = await this.restaurantRepository.findAndCount();
      if (counts === 0) {
        return {
          ok: true,
          counts,
        };
      }
      return {
        ok: true,
        restaurants,
        counts,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Cannot find restaurants.',
      };
    }
  }
}
