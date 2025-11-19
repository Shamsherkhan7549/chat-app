import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BACKEND_URL);

const App = () => {
  const [socketId, setSocketId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [roomName, setRoomName] = useState("");
  const [joinRoomName, setJoinRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const listRef = useRef(null);

  // helper to push message objects
  const pushMessage = (m) => {
    setMessages(prev => [...prev, m]);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!messageText.trim()) return;

    const payload = {
      message: messageText.trim(),
      room: roomName.trim()
    };

    // Emit same events you had before
    socket.emit("message", payload);
    socket.emit("greet", { message: messageText.trim()});
    socket.emit("bye", messageText.trim());

    // locally add the sent message so UI is instant
    pushMessage({ text: messageText.trim(), from: socket.id, meta: { toId: targetId, room: roomName, type: "outgoing" } });

    setMessageText("");
  };

  const handleJoin = (e) => {
    e?.preventDefault();
    if (!joinRoomName.trim()) return;
    setRoomName(joinRoomName.trim());
    socket.emit("join-room", joinRoomName.trim());
    setJoinRoomName("");
  };

  useEffect(() => {
    const onConnect = () => {
      setSocketId(socket.id);
      setConnected(true);
    };
    const onDisconnect = () => {
      setConnected(false);
      pushMessage({ text: "Disconnected from server", from: "system", meta: { type: "system" } });
    };

    const onMessage = (payload) => {
      // supports payload either string or object
      const text = typeof payload === "string" ? payload : payload.message || JSON.stringify(payload);
      pushMessage({ text, from: payload?.from || "server", meta: { raw: payload, type: "incoming" } });
    };

    const onGreet = (payload) => {
      const text = payload?.message || "greet";
      pushMessage({ text: `GREET: ${text}`, from: payload?.from || "server", meta: { type: "greet" } });
    };

    const onBye = (payload) => {
      const text = typeof payload === "string" ? payload : payload?.message || "bye";
      pushMessage({ text: `BYE: ${text}`, from: payload?.from || "server", meta: { type: "bye" } });
    };

    const onRoomJoined = (room) => {
      pushMessage({ text: `Joined room: ${room}`, from: "system", meta: { type: "system" } });
    };

    // register
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);
    socket.on("greet", onGreet);
    socket.on("bye", onBye);
    socket.on("room-joined", onRoomJoined);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
      socket.off("greet", onGreet);
      socket.off("bye", onBye);
      socket.off("room-joined", onRoomJoined);
    };
  }, []);

  // scroll to bottom when messages update
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div style={{
        fontFamily: 'Segoe UI, Roboto, system-ui, -apple-system',
        maxWidth: 900,
        margin: '20px auto',
        padding: 16,
        border: '1px solid #eee',
        borderRadius: 8,
        boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
      }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 style={{ margin: 0 }}>ChatApp</h3>
            <div style={{ fontSize: 12, color: '#666' }}>
              Socket ID: <strong>{socketId || "—"}</strong>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: connected ? '#0a0' : '#a00' }}>{connected ? 'Connected' : 'Disconnected'}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{import.meta.env.VITE_BACKEND_URL}</div>
          </div>
        </header>

        <main style={{ display: 'flex', gap: 12 }}>
          <section style={{ flex: 1 }}>
            <div ref={listRef} style={{
              height: 380,
              overflowY: 'auto',
              padding: 12,
              border: '1px solid #f0f0f0',
              borderRadius: 6,
              background: '#fafafa'
            }}>
              {messages.map((m, i) => {
                const isMe = m.from === socketId;
                const isSystem = m.from === 'system' || m.from === 'server';
                return (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                    marginBottom: 8
                  }}>
                    <div style={{
                      maxWidth: '75%',
                      background: isSystem ? '#fff3cd' : (isMe ? '#007bff' : '#e9ecef'),
                      color: isMe ? '#fff' : '#222',
                      padding: '8px 10px',
                      borderRadius: 8,
                      fontSize: 14,
                      boxShadow: isSystem ? 'none' : '0 1px 0 rgba(0,0,0,0.02)'
                    }}>
                      {!isMe && !isSystem && <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>From: {m.from}</div>}
                      <div>{m.text}</div>
                      {m.meta?.toId && <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>toId: {m.meta.toId}</div>}
                      {m.meta?.room && <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>room: {m.meta.room}</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={roomName} placeholder="room name (emit)" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
              </div>
              
              <input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message and press Send"
                style={{ flex: 1, padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd' }}
              />
              
              <button type="submit" style={{ padding: '10px 14px', borderRadius: 6, background: '#007bff', color: '#fff', border: 'none' }}>Send</button>
            </form>
          </section>

          <aside style={{ width: 280 }}>
            <div style={{ marginBottom: 12 }}>
              <h4 style={{ margin: '0 0 8px 0' }}>Send options</h4>
             
              
            </div>

            <div style={{ marginBottom: 12 }}>
              <h4 style={{ margin: '0 0 8px 0' }}>Rooms</h4>
              <form onSubmit={handleJoin} style={{ display: 'flex', gap: 8 }}>
                <input value={joinRoomName} onChange={e => setJoinRoomName(e.target.value)} placeholder="join room" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                <button type="submit" style={{ padding: '8px 10px', borderRadius: 6, background: '#28a745', color: '#fff', border: 'none' }}>Join</button>
              </form>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0' }}>Quick actions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => { setMessageText('Hello from UI'); }} style={{ padding: 8, borderRadius: 6 }}>Insert test message</button>
                <button onClick={() => { setMessages([]); }} style={{ padding: 8, borderRadius: 6 }}>Clear chat</button>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </>
  );
};

export default App;