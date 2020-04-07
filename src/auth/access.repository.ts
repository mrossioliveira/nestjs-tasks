import { Repository, EntityRepository } from 'typeorm';
import { Access } from './access.entity';

import { v4 as uuidv4 } from 'uuid';

@EntityRepository(Access)
export class AccessRepository extends Repository<Access> {
  async findOneByUsernameAndToken(
    username: string,
    refreshToken: string,
  ): Promise<{ username: string; refreshToken: string }> {
    const query = this.createQueryBuilder('access')
      .where('access.username = :username', { username })
      .andWhere('access.refresh_token = :refreshToken', { refreshToken });

    const access = await query.getOne();
    return access;
  }

  async getRefreshTokenByUsername(username: string): Promise<Access> {
    const access = await this.findOne({ username });
    if (access) {
      return access;
    } else {
      const refreshToken = uuidv4();
      return this.save({ username, refreshToken });
    }
  }
}
