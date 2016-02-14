## Emotolize Backend(HTTP and Web Socket based server)

## Network:
- Dev server:
  - Host URL: ec2-54-200-226-3.us-west-2.compute.amazonaws.com
  - PORT: 80
```bash
curl http://ec2-54-200-226-3.us-west-2.compute.amazonaws.com/socket.io/socket.io.js
```

## HTTP:
<a name="headers">
### Headers:
- Common headers
  - Content-Type: application/json
  - Accept: application/json

### Emotion data API
- POST /api/emotion/
  - A JSON end point used to send streaming of data
  - headers: [Common headers](#headers)
  - request(JSON)
    - body(JSON):
      - same as [streaming object](#streaming)
  - response(JSON)
    - ok

- POST /api/emotion/done/
  - A JSON end point used to inform the end of streaming of data
  - headers: [Common headers](#headers)
  - request(JSON)
    - body(JSON):
      - None
  - response(JSON)
    - ok


## Websocket:
### Connect
- Connect URL: ec2-54-200-226-3.us-west-2.compute.amazonaws.com/emo-socket
If connection succeeds, server will immediately send the event **connected** with the message [connected](#connected)

### Get streaming
- After connection succeed, server will keep pushing the event **connected** with the message [streaming](#streaming), which is the same as the object from Android application. This server just bypasses objects from an android to a web socket client.

### End of streaming
- Once a series of streaming events are done, server will push the event **done** with the message [done](#done). Any **streaming** events after this **done** events represent a new stream data.

## Messages
<a name="connected">
### connected
- Web Socket Object
  - socket_id: String, socket id of this client

<a name="streaming">
### streaming
- Web Socket Object
  - faceId: Number
  - contempt: Number
  - disgust: Number
  - fear: Number
  - happiness: Number
  - neutral: Number
  - sadness: Number
  - faceRectangle: Array of Numbers, length 4

<a name="done">
### done
- Web Socket Object
  - profit!

## Run server
1. Install [Fabric](http://www.fabfile.org/) in your local machine
2. Run ```fab devweek rerun:<your redis secret here>``` on the terminal
3. ???
4. PROFIT!
