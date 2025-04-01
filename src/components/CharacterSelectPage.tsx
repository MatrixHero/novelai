import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { characters, Character } from '../services/aiService';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  transition: opacity 0.5s ease;

  &.fade-out {
    opacity: 0;
  }

  @media (orientation: landscape) {
    padding: 30px;
  }
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

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #fff;
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);

  @media (orientation: landscape) {
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }
`;

const CharacterGreeting = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  text-align: center;
  position: relative;
  overflow: hidden;

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

  @media (orientation: landscape) {
    margin-bottom: 30px;
    padding: 20px 30px;
  }
`;

const GreetingText = styled.p`
  font-size: 16px;
  color: #fff;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);

  @media (orientation: landscape) {
    font-size: 18px;
  }
`;

const SelectedCharacterSection = styled.div`
  width: 100%;
  max-width: 600px;
  flex: 1;
  min-height: 0;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  overflow: hidden;

  @media (orientation: landscape) {
    margin-bottom: 30px;
    padding: 20px;
    gap: 20px;
  }
`;

const SelectedCharacterImageContainer = styled.div`
  width: 100%;
  height: 40%;
  min-height: 180px;
  max-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px;

  @media (orientation: landscape) {
    height: 45%;
    min-height: 200px;
    padding: 10px;
  }
`;

const SelectedCharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  border-radius: 12px;
  border: 2px solid #ff69b4;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
`;

const SelectedCharacterInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 12px;

  @media (orientation: landscape) {
    gap: 15px;
    padding: 15px;
  }
`;

const SelectedCharacterName = styled.h2`
  font-size: 20px;
  color: #ff69b4;
  margin: 0;
  text-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 105, 180, 0.3);

  @media (orientation: landscape) {
    font-size: 24px;
    padding-bottom: 10px;
  }
`;

const SelectedCharacterDescription = styled.p`
  font-size: 14px;
  color: #fff;
  line-height: 1.5;
  margin: 0;
  overflow-y: auto;
  flex: 1;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }

  @media (orientation: landscape) {
    font-size: 16px;
    line-height: 1.6;
    padding-right: 10px;
  }
`;

const SelectedCharacterBackground = styled.p`
  font-size: 12px;
  color: #ccc;
  line-height: 1.4;
  margin: 0;
  overflow-y: auto;
  max-height: 60px;
  padding-right: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 8px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }

  @media (orientation: landscape) {
    font-size: 14px;
    line-height: 1.5;
    max-height: 80px;
    padding-right: 10px;
    padding-top: 10px;
  }
`;

const CharacterSelectionSection = styled.div`
  width: 100%;
  height: 100px;
  position: relative;
  padding: 0 40px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px 20px 0 0;
  display: flex;
  align-items: center;

  @media (orientation: landscape) {
    height: 120px;
  }
`;

const ScrollContainer = styled.div`
  width: 100%;
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 10px;
  overflow: hidden;

  @media (orientation: landscape) {
    padding: 0 30px;
  }
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;

  &:first-child {
    left: 10px;
  }

  &:last-child {
    right: 10px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-50%) scale(1.1);
  }

  @media (orientation: landscape) {
    width: 50px;
    height: 50px;
    font-size: 24px;

    &:first-child {
      left: 20px;
    }

    &:last-child {
      right: 20px;
    }
  }
`;

const CharacterList = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  align-items: center;
  height: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
`;

interface CharacterCardProps {
  isSelected: boolean;
}

const CharacterCard = styled.div<CharacterCardProps>`
  flex: 0 0 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid ${props => props.isSelected ? '#ff69b4' : 'transparent'};
  transform: ${props => props.isSelected ? 'scale(1.1)' : 'scale(1)'};
  z-index: ${props => props.isSelected ? '2' : '1'};

  &:hover {
    transform: translateY(-5px) ${props => props.isSelected ? 'scale(1.1)' : 'scale(1)'};
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  @media (orientation: landscape) {
    flex: 0 0 80px;
    height: 80px;
    border-radius: 12px;
  }
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px;
`;

const CharacterName = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 11px;
  padding: 3px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (orientation: landscape) {
    font-size: 12px;
    padding: 4px;
  }
`;

const EnterButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(45deg, #ff69b4, #ff1493);
  border: none;
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
  z-index: 10;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (orientation: landscape) {
    bottom: 30px;
    right: 30px;
    padding: 15px 40px;
    font-size: 18px;
  }
`;

const CharacterSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEntering, setIsEntering] = useState(false);
  const characterListRef = useRef<HTMLDivElement>(null);

  const handleCharacterSelect = (character: Character) => {
    navigate(`/chat/${character.name}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/characters/compressed/default-character.jpg';
  };

  const scrollToCharacter = (index: number) => {
    if (characterListRef.current) {
      const container = characterListRef.current;
      const containerWidth = container.clientWidth;
      const cardWidth = 140;
      const gap = 15;
      
      // 计算目标滚动位置，使卡片完全居中
      const targetScroll = (index * (cardWidth + gap)) - (containerWidth / 2) + (cardWidth / 2);
      
      // 确保滚动位置在有效范围内
      const maxScroll = container.scrollWidth - containerWidth;
      const finalScroll = Math.max(0, Math.min(targetScroll, maxScroll));
      
      // 立即滚动到目标位置
      container.scrollTo({
        left: finalScroll,
        behavior: 'smooth'
      });
    }
  };

  // 监听选中索引变化，自动滚动到中心
  React.useEffect(() => {
    scrollToCharacter(selectedIndex);
  }, [selectedIndex]);

  // 修改左右按钮点击处理
  const handleLeftClick = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : characters.length - 1;
    setSelectedIndex(newIndex);
  };

  const handleRightClick = () => {
    const newIndex = selectedIndex < characters.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
  };

  const handleEnter = () => {
    if (isEntering) return;
    setIsEntering(true);
    
    // 添加淡出动画
    const container = document.querySelector('.container');
    if (container) {
      container.classList.add('fade-out');
    }

    // 延迟导航，等待动画完成
    setTimeout(() => {
      navigate(`/chat/${characters[selectedIndex].name}`);
    }, 500);
  };

  // 根据角色性格生成开场白
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

    // 根据性格关键词匹配开场白
    for (const [trait, greeting] of Object.entries(greetings)) {
      if (character.personality.includes(trait)) {
        return greeting;
      }
    }

    // 默认开场白
    return '很高兴见到你，让我们一起创造美好的回忆吧！';
  };

  return (
    <Container className="container">
      <BackButton onClick={handleBack}>
        ← 返回首页
      </BackButton>
      <Title>选择你的心动对象</Title>
      
      {characters[selectedIndex] && (
        <SelectedCharacterSection>
          <SelectedCharacterImageContainer>
            <SelectedCharacterImage
              src={characters[selectedIndex].imageUrl || '/characters/compressed/default-character.jpg'}
              alt={characters[selectedIndex].name}
              onError={handleImageError}
            />
          </SelectedCharacterImageContainer>
          <SelectedCharacterInfo>
            <SelectedCharacterName>{characters[selectedIndex].name}</SelectedCharacterName>
            <SelectedCharacterDescription>{characters[selectedIndex].personality}</SelectedCharacterDescription>
            <SelectedCharacterBackground>{characters[selectedIndex].background}</SelectedCharacterBackground>
          </SelectedCharacterInfo>
        </SelectedCharacterSection>
      )}

      <CharacterSelectionSection>
        <ScrollButton onClick={handleLeftClick}>←</ScrollButton>
        <CharacterList ref={characterListRef}>
          {characters.map((character, index) => {
            const isSelected = index === selectedIndex;
            return (
              <CharacterCard
                key={character.name}
                isSelected={isSelected}
                onClick={() => setSelectedIndex(index)}
              >
                <CharacterImage
                  src={character.imageUrl || '/characters/compressed/default-character.jpg'}
                  alt={character.name}
                  onError={handleImageError}
                />
                <CharacterName>{character.name}</CharacterName>
              </CharacterCard>
            );
          })}
        </CharacterList>
        <ScrollButton onClick={handleRightClick}>→</ScrollButton>
      </CharacterSelectionSection>

      {selectedIndex !== null && (
        <EnterButton onClick={handleEnter}>
          开始对话 →
        </EnterButton>
      )}
    </Container>
  );
};

export default CharacterSelectPage; 