#### Install

```
npm install gsemir-request-impl@latest
```

#### Usage

```typescript
// fetch
const req = new RequestImpl(fetch)

// axios
const axiosInstance = axios.create()
const req = new RequestImpl(axiosInstance)

// get
const res = await req.get('https://xxx.com', { page: 1, pageSize: 20 })

// post
const post = await req.post('https://xxx.com', { name: 'gsemir', age: 10 })
```
