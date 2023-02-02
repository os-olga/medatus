import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { PassportSerializer } from '@nestjs/passport';

export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err, user: User) => void) {
    console.log('Serialize');
    done(null, user);
  }

  async deserializeUser(
    payload: any,
    done: (err: Error, payload: string) => void,
  ) {
    console.log('Deserialize');
    // return await this.userService.byId({ id: Number(userId) })
    // .then(user => done(null, user))
    // .catch(error => done(error));

    done(null, payload);
  }
}
