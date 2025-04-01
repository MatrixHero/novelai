import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { getAIResponse, Character } from '../services/aiService';
import type { Message } from '../services/aiService';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CharacterHeader = styled.div`
  width: 100%;
  height: 60px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
`;

const CharacterAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const CharacterName = styled.span`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(0, 0, 0, 0.3);
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  background-color: ${props => props.isUser ? '#007AFF' : '#E9ECEF'};
  color: ${props => props.isUser ? '#FFFFFF' : '#000000'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  word-wrap: break-word;
`;

const InputArea = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  outline: none;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;

  &:disabled {
    background-color: rgba(255, 255, 255, 0.05);
    cursor: not-allowed;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;

  &:disabled {
    background-color: #CCCCCC;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

const LoadingMessage = styled.div`
  padding: 10px 15px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  align-self: flex-start;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const ChatInterface: React.FC<{ character: Character }> = ({ character }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadingInterval = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      setLoadingMessage(character.loadingMessages[0]);
      const interval = loadingInterval.current;
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [isLoading, character]);

  const handleBack = () => {
    navigate('/characters');
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(character, input, messages);
      const aiMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container>
      <BackButton onClick={handleBack}>
        ← 返回角色选择
      </BackButton>
      <CharacterHeader>
        <CharacterAvatar src={character.imageUrl} alt={character.name} />
        <CharacterName>{character.name}</CharacterName>
      </CharacterHeader>
      <ChatArea>
        {messages.map((message, index) => (
          <MessageBubble key={index} isUser={message.role === 'user'}>
            {message.content}
          </MessageBubble>
        ))}
        {isLoading && (
          <LoadingMessage>
            {loadingMessage}
          </LoadingMessage>
        )}
        <div ref={messagesEndRef} />
      </ChatArea>
      <InputArea>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`和${character.name}聊天...`}
          disabled={isLoading}
        />
        <SendButton onClick={handleSend} disabled={isLoading}>
          发送
        </SendButton>
      </InputArea>
    </Container>
  );
};

export default ChatInterface; 