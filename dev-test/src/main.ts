import * as session from 'express-session';
import * as passport from 'passport';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      name: 'NESTJS_SESSION_ID',
      secret: 'DADADADKAKAKIAUANAANSADASDASDASDADAD',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    credentials: true,
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const PORT = process.env.PORT || 8080;

  await app.listen(PORT, null, () => {
    console.log(`port ${PORT}`);
  });
}
bootstrap();
