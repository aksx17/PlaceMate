# Quick Fix: GitHub Integration Not Working

## The Problem
Getting errors like:
- ❌ "Failed to fetch GitHub profile"
- ❌ "Request failed with status code 404"
- ❌ Resume/Portfolio/Interview generation failing

## The Solution

You need to provide a valid GitHub username. Here are 3 ways to fix it:

---

### Option 1: Add to Your Profile (Recommended)

1. **Login to PlaceMate**
2. **Go to Profile/Settings**
3. **Add your GitHub username**
   - Example: If your GitHub is `https://github.com/torvalds`, enter `torvalds`
4. **Save**

Now all features will automatically use your saved username!

---

### Option 2: Provide When Using Features

When generating Resume/Portfolio/Interview, fill in the GitHub username field:

**Resume Page:**
```
GitHub Username: [ your-username ]
```

**Portfolio Page:**
```
GitHub Username: [ your-username ]  ← Required
```

**Interview Page:**
```
GitHub Username: [ your-username ]
```

---

### Option 3: Update Via API

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"githubUsername": "your-username"}'
```

---

## How to Find Your GitHub Username

1. Go to github.com
2. Click your profile picture (top right)
3. Your username is shown below your name
4. Or check your profile URL: `github.com/YOUR-USERNAME`

---

## Validation

To check if a GitHub username is valid:

```bash
curl -X POST http://localhost:5000/api/auth/validate-github \
  -H "Content-Type: application/json" \
  -d '{"username": "torvalds"}'
```

**Success Response:**
```json
{
  "success": true,
  "message": "GitHub username is valid",
  "data": {
    "username": "torvalds",
    "name": "Linus Torvalds",
    "publicRepos": 4
  }
}
```

---

## Important Notes

- ✅ **Resume Generation**: Works without GitHub (optional)
- ✅ **Interview Questions**: Works without GitHub (optional)
- ⚠️ **Portfolio Generation**: **Requires** valid GitHub username
- 💡 Using GitHub username enhances AI quality with your real projects!

---

## Still Having Issues?

### Check Environment Variables

Make sure backend has GitHub token in `.env`:
```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

**Get a token:**
1. GitHub → Settings → Developer settings
2. Personal access tokens → Generate new token
3. Select: `public_repo`, `read:user`
4. Copy and add to `.env`

### Common Mistakes

❌ Using full URL: `https://github.com/username`
✅ Just username: `username`

❌ Using @ symbol: `@username`
✅ Just username: `username`

❌ Non-existent username
✅ Verify username exists on github.com

---

## Need Help?

Check the logs for specific error messages:
- "GitHub user 'X' does not exist" → Username is wrong
- "GitHub username is required" → Provide username
- "Failed to fetch GitHub profile" → Check GITHUB_TOKEN in .env
