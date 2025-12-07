import React, { useState } from 'react'; // Import useState
import DocItem from '@theme-original/DocItem';
import TextSelection from '@site/src/components/TextSelection';
import PersonalizeButton from '@site/src/components/PersonalizeButton'; // Import PersonalizeButton
import TranslateButton from '@site/src/components/TranslateButton'; // Import TranslateButton
import { useHistory } from '@docusaurus/router';
// import { useDoc } from '@docusaurus/theme-common/internal'; // Not directly used here anymore

export default function DocItemWrapper(props) {
  const history = useHistory();
  const [personalizedContent, setPersonalizedContent] = useState(null); // State for personalized/translated content

  const handleSelectedTextForChatbot = (selectedText) => {
    history.push(`/chatbot?context=${encodeURIComponent(selectedText)}`);
  };

  const handleDynamicContent = (newContent) => {
    setPersonalizedContent(newContent);
  };

  return (
    <>
      <TextSelection onSelectText={handleSelectedTextForChatbot} />
      {/* Personalize and Translate Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <PersonalizeButton onPersonalize={handleDynamicContent} />
        <TranslateButton onTranslate={handleDynamicContent} />
      </div>
      
      {personalizedContent ? (
        // Render personalized/translated content if available
        <div 
          dangerouslySetInnerHTML={{ __html: personalizedContent }} 
          style={{ direction: (personalizedContent.includes('اردو') || personalizedContent.includes('Urdu')) ? 'rtl' : 'ltr' }} // Basic RTL detection
        />
      ) : (
        // Render original DocItem (which renders the original content)
        <DocItem {...props} />
      )}
    </>
  );
}
