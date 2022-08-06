# What's new?

## useController

- We now have the possibility to access our data both on success and on error in the useController via the `onResult`. This could be useful if you wanted to format your responses in a particular way before they got to your api clients.

### onResult

The onResult callback takes 2 arguments, the data (response data / ApiError details) and the success status of the operation (a boolean). Anything returned from this function would be the the final result of your task

```javascript
function onResult(data, success) {
  // some logic here
  return { data, success };
}

app.get("/", makeCallback(useController(task, options, onResult)));
```
