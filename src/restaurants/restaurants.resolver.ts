import { Query, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { getAllRestaurantsOutput } from './dtos/all-restaurants.dto';
import { Restaurant } from './entities/restaurants.entity';
import { RestaurantsService } from './restaurants.service';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}
  @Query((returns) => getAllRestaurantsOutput)
  @Role(['User'])
  async getAllRestaurants(): Promise<getAllRestaurantsOutput> {
    return this.restaurantsService.getAllRestaurants();
  }
}
