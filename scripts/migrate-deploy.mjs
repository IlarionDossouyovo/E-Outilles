// Neon suspends idle computes, so the first connection after a pause can take
// longer than Prisma's 10s advisory-lock timeout (P1002). Warm the database,
// then retry `migrate deploy` a few times before giving up.
import { execSync } from 'node:child_process'

const attempts = 6
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

for (let i = 1; i <= attempts; i++) {
  try {
    execSync('npx prisma db execute --stdin', { input: 'SELECT 1;', stdio: ['pipe', 'ignore', 'ignore'] })
    console.log(`Database awake (warm-up ${i}).`)
    break
  } catch {
    console.log(`Warm-up ${i}/${attempts} failed, retrying…`)
    await wait(5000)
  }
}

for (let i = 1; i <= attempts; i++) {
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    process.exit(0)
  } catch {
    console.log(`Migration attempt ${i}/${attempts} failed, retrying…`)
    if (i === attempts) process.exit(1)
    await wait(8000)
  }
}
