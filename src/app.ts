import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

/**
 * The following regexes are used to validate the URL query string.
 * URL is valid if it contains only alphanumeric characters, hyphens, and underscores.
 * We can have multiple parts separated by slashes with an optional trailing slash.
 * 
 * The bad regex works however it is not the most efficient way to validate the URL.
 * Depending on the input and the regex engine, it can take a long time to validate the URL.
 * 
 * The good regex is more efficient and can validate the URL in a shorter time.
 * It happens mostly because the optional part is at the end of the regex and it is not a part of the capturing group with repetition.
 */
const VALIDATION_REGEXES = {
  bad: /^([a-zA-Z-_0-9]+\/?)*$/,
  good: /^([a-zA-Z-_0-9]+\/)*([a-zA-Z-_0-9]+\/?)?$/,
}

const VALIDATION_REGEX = process.env.USE_BAD_REGEX === 'true' ? VALIDATION_REGEXES.bad : VALIDATION_REGEXES.good

app.get('/slugs', async (c) => {
  const url = c.req.query('url')

  if (!url) {
    return c.text('missing url query string', 400)
  }

  const valid = VALIDATION_REGEX.test(url)

  return c.json({valid}, 200)
})

export default app
