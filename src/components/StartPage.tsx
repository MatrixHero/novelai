import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: fadeIn 1s ease-in;

  @media (orientation: landscape) {
    font-size: 3rem;
    margin-bottom: 3rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  line-height: 1.6;
  animation: fadeIn 1s ease-in 0.3s backwards;

  @media (orientation: landscape) {
    font-size: 1.4rem;
    margin-bottom: 4rem;
  }
`;

const StartButton = styled.button`
  padding: 15px 40px;
  font-size: 1.2rem;
  color: #fff;
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  animation: fadeIn 1s ease-in 0.6s backwards;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (orientation: landscape) {
    padding: 18px 50px;
    font-size: 1.4rem;
  }
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(22, 33, 62, 0.9) 100%);
  z-index: -1;
`;

const StartPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/characters');
  };

  return (
    <Container>
      <BackgroundOverlay />
      <Title>心动时刻</Title>
      <Subtitle>
        在这个充满浪漫的世界里，与心仪的角色相遇，
        展开一段难忘的对话之旅。
      </Subtitle>
      <StartButton onClick={handleStart}>
        开始你的心动之旅
      </StartButton>
    </Container>
  );
};

export default StartPage; 