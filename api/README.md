# API Folder (Vercel Serverless Functions)

All files in this folder are automatically deployed as serverless functions on Vercel.

## File Structure

- `hello.ts` - Example API endpoint at `/api/hello`
- Create new files like `users.ts`, `posts.ts`, etc.

## Example

File: `api/users.ts` → Endpoint: `/api/users`

## Usage

```typescript
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ message: 'Hello' });
}
```

## Accessing from Frontend

```typescript
const response = await fetch('/api/hello?name=User');
const data = await response.json();
console.log(data);
```
