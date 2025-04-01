import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { characters, Character, getAIResponse } from '../services/aiService';
import type { Message } from '../services/aiService';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  position: relative;
  overflow: hidden;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  gap: 20px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const MessageWrapper = styled.div<{ isUser: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  max-width: 80%;
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
`;

const MessageAvatar = styled.div<{ isUser: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid ${props => props.isUser ? '#4a90e2' : 'rgba(255, 255, 255, 0.3)'};
  box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
  background: ${props => props.isUser ? 'linear-gradient(45deg, #4a90e2, #357abd)' : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const UserAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #4a90e2, #357abd);
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  padding: 0;
  letter-spacing: 2px;
  line-height: 1;
  transform: translateY(1px);
`;

const MessageAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
`;

const Message = styled.div<{ isUser: boolean }>`
  padding: 12px 16px;
  border-radius: 15px;
  background: ${props => props.isUser ? 'rgba(255, 105, 180, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  font-size: 16px;
  line-height: 1.5;
  position: relative;
  animation: fadeIn 0.3s ease;
  margin-left: ${props => props.isUser ? '0' : '10px'};
  margin-right: ${props => props.isUser ? '10px' : '0'};

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LoadingMessage = styled(Message)`
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 10px;
  margin-right: 0;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  
  span {
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    animation: bounce 1.4s infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes bounce {
    0%, 80%, 100% { 
      transform: scale(0);
    }
    40% { 
      transform: scale(1);
    }
  }
`;

const GreetingMessage = styled(Message)`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-style: italic;
  text-align: center;
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
  font-size: 18px;
  line-height: 1.6;
  position: relative;

  &::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 10px;
    font-size: 60px;
    color: rgba(255, 255, 255, 0.1);
    font-family: serif;
  }

  &::after {
    content: '"';
    position: absolute;
    bottom: -20px;
    right: 10px;
    font-size: 60px;
    color: rgba(255, 255, 255, 0.1);
    font-family: serif;
  }
`;

const InputContainer = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
  }
`;

const SendButton = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff69b4, #ff1493);
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(255, 105, 180, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Header = styled.div`
  width: 100%;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  margin-right: 15px;

  &:hover {
    opacity: 0.8;
  }
`;

const HeaderTitle = styled.div`
  flex: 1;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-style: italic;

  span {
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    animation: bounce 1.4s infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes bounce {
    0%, 80%, 100% { 
      transform: scale(0);
    }
    40% { 
      transform: scale(1);
    }
  }
`;

const CharacterAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ff69b4;
  box-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
`;

const CharacterAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
`;

const CharacterInfo = styled.div`
  flex: 1;
`;

const CharacterName = styled.h2`
  margin: 0;
  color: #fff;
  font-size: 18px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const CharacterPersonality = styled.p`
  margin: 5px 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

const ChatPage: React.FC = () => {
  const { characterName } = useParams<{ characterName: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const character = characters.find(c => c.name === characterName);

  useEffect(() => {
    if (!character) {
      navigate('/');
      return;
    }

    // 获取角色开场白
    const greeting = getCharacterGreeting(character);
    
    // 延迟显示开场白，创造更好的体验
    setTimeout(() => {
      setMessages([{ text: greeting, isUser: false }]);
    }, 500);
  }, [character, navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getCharacterGreeting = (character: Character) => {
    const greetings: { [key: string]: string } = {
      '温柔体贴': '很高兴见到你，希望我们能成为好朋友呢~',
      '活泼开朗': '哇！终于见到你了！让我们一起创造美好的回忆吧！',
      '傲娇': '哼！才不是特意来见你的呢...不过既然来了，就好好相处吧。',
      '高冷': '...（轻轻点头）希望你能理解我的性格。',
      '元气满满': '嗨嗨！今天也要元气满满哦！让我们一起加油吧！',
      '害羞': '啊...那个...很高兴认识你...（小声）',
      '成熟稳重': '很高兴认识你，希望我们能互相理解，共同成长。',
      '调皮可爱': '嘻嘻~终于等到你啦！让我们一起玩得开心吧！',
      '认真负责': '我会认真对待我们的每一次对话，请多指教。',
      '神秘': '终于等到你了...让我们开始这段奇妙的旅程吧。'
    };

    for (const [trait, greeting] of Object.entries(greetings)) {
      if (character.personality.includes(trait)) {
        return greeting;
      }
    }

    return '很高兴见到你，让我们一起创造美好的回忆吧！';
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);
    setIsTyping(true);
    setShowTypingIndicator(true);

    try {
      // 将消息历史转换为 AI 服务需要的格式
      const messageHistory: Message[] = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      // 模拟随机停顿和输入状态
      const randomPauses = [800, 1200, 1500, 2000, 2500];
      const pause = randomPauses[Math.floor(Math.random() * randomPauses.length)];
      await new Promise(resolve => setTimeout(resolve, pause));

      // 随机隐藏"正在输入"提示
      const shouldHideTyping = Math.random() < 0.3;
      if (shouldHideTyping) {
        setShowTypingIndicator(false);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowTypingIndicator(true);
      }

      const response = await getAIResponse(character!, userMessage, messageHistory);
      
      // 再次随机停顿
      const finalPause = randomPauses[Math.floor(Math.random() * randomPauses.length)];
      await new Promise(resolve => setTimeout(resolve, finalPause));
      
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        text: '抱歉，我现在有点累了，让我们稍后再聊吧...', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      setShowTypingIndicator(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!character) return null;

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          ←
        </BackButton>
        <HeaderTitle>
          {isTyping && showTypingIndicator ? (
            <TypingIndicator>
              正在输入
              <span></span>
              <span></span>
              <span></span>
            </TypingIndicator>
          ) : (
            character.name
          )}
        </HeaderTitle>
      </Header>
      <ChatContainer ref={chatContainerRef}>
        {messages.map((message, index) => (
          <MessageWrapper key={index} isUser={message.isUser}>
            <MessageAvatar isUser={message.isUser}>
              {message.isUser ? (
                <UserAvatar>旅人</UserAvatar>
              ) : (
                <MessageAvatarImage
                  src={character.imageUrl || '/characters/compressed/default-character.jpg'}
                  alt={character.name}
                  onError={(e) => {
                    e.currentTarget.src = '/characters/compressed/default-character.jpg';
                  }}
                />
              )}
            </MessageAvatar>
            <Message isUser={message.isUser}>
              {message.text}
            </Message>
          </MessageWrapper>
        ))}
        {isLoading && (
          <MessageWrapper isUser={false}>
            <MessageAvatar isUser={false}>
              <MessageAvatarImage
                src={character.imageUrl || '/characters/compressed/default-character.jpg'}
                alt={character.name}
                onError={(e) => {
                  e.currentTarget.src = '/characters/compressed/default-character.jpg';
                }}
              />
            </MessageAvatar>
            <LoadingMessage isUser={false}>
              {character.loadingMessages[0]}
              <LoadingDots>
                <span></span>
                <span></span>
                <span></span>
              </LoadingDots>
            </LoadingMessage>
          </MessageWrapper>
        )}
      </ChatContainer>
      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          disabled={isLoading}
        />
        <SendButton onClick={handleSend} disabled={isLoading}>
          →
        </SendButton>
      </InputContainer>
    </Container>
  );
};

export default ChatPage; 