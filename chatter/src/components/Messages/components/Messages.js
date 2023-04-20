import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import useSound from 'use-sound';
import config from '../../../config';
import LatestMessagesContext from '../../../contexts/LatestMessages/LatestMessages';
import TypingMessage from './TypingMessage';
import Header from './Header';
import Footer from './Footer';
import Message from './Message';
import '../styles/_messages.scss';
import initialBottyMessage from '../../../common/constants/initialBottyMessage';

const socket = io(
  config.BOT_SERVER_ENDPOINT,
  { transports: ['websocket', 'polling', 'flashsocket'] }
);

const ME = 'me';

function Messages() {
  const [playSend] = useSound(config.SEND_AUDIO_URL);
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const { setLatestMessage } = useContext(LatestMessagesContext);

  // Internal state for messages
  const [messageList, setMessageList] = useState([{ user: 1, id: -1, message: initialBottyMessage }])
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageID, setMessageID] = useState(0)
  const [botTyping, setBotTyping] = useState(false)

  function changeMessage(event) {
    setCurrentMessage(event.target.value)
  }


  function updateMessageList(message, user) {
    const nextMessage = {
      id: messageID,
      user: user,
      message: message
    }
    setMessageList(prevMessageList => [...prevMessageList, nextMessage])
    setMessageID(prevMessageID => prevMessageID + 1)
    setCurrentMessage("")
    return nextMessage
  }

  function sendMessage() {
    const nextMessage = updateMessageList(currentMessage, ME)
    setLatestMessage("bot", nextMessage.message)
    socket.emit('user-message', nextMessage.message)
    playSend()
  }


  function recieveMessage(message) {
    const nextMessage = updateMessageList(message, "bot")
    setLatestMessage("bot", nextMessage.message)
    playReceive()
  }

  useEffect(() => {
    socket.on('bot-message', (message) => {
      recieveMessage(message)
      setBotTyping(false)
    });

    socket.on('bot-typing', () => {
      setBotTyping(true)
    });
  }, [])

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        {messageList.map(message => (
          <Message message={message} nextMessage={message} botTyping={botTyping} />
        ))}
        {botTyping && <TypingMessage />}
      </div>
      <Footer message={currentMessage} sendMessage={sendMessage} onChangeMessage={changeMessage} />
    </div>
  );
}

export default Messages;