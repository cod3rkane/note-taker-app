- Once you have cloned the repo
- At the root directory simply run `docker-compose up`
- Then you need to run the migrations `docker-compose exec backend yarn dlx prisma migrate dev -n migration`
- Finally, you can run the seed `docker-compose exec backend yarn seed`
- Open the app with Firefox or Chrome using http://localhost:3000/
- For real-time open two browsers using http://localhost:3000/QVjFl_bCKGJgQVgXAAAG 
  - OR http://localhost:3000/${ROOM_ID} this can be any word, hash, name...

- Enjoy the Note Taker App.
