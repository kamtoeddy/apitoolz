# What's new?

- We now have the possibility to format pass a general formatter to our useController

## useController

### onResult

The onResult callback takes 2 arguments, the data (response data / ApiError details) and the success status of the operation (a boolean). Anything returned from this function would be the the final result of your task

```javascript
function onResult(data, success) {
  // some logic here
  return { data, success };
}

app.get("/", makeCallback(useController(task, options, onResult)));
```
