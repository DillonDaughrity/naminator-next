Why should .env.local never be committed?

- .env.local should never be committed because of the sensitive data that it contains. That is where database URLs, API keys, and other secretive information is stored and used. The problem with committing this file is that it will allow any users who look at you GitHub repo and your edit history to see all these secrets. If the public gets access to these secrets, then there is a lot of harm that they could do.

Why are GitHub Secrets safer than plain environment variables?

- GitHub Secrets are safer than plain environment variables because it completely eliminates the need for a .env file. This ensures that there is absolutely no way that any secrets could get included in any commits because they were never in your code in the first place. It also allows for easy updating of any URLs or keys without changing any of your existing code.

What would happen if you wrote the following in your yml file? 
env:
  DATABASE_URL: "hardcoded-value"

- If you were to write that in the yml file, then it would be committed which would allow any user to look inside that file and find your DATABASE_URL value, meaning they could easily access your database and cause any harm that they wanted to.