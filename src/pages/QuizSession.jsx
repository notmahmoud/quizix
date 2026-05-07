import { Loader2 } from 'lucide-react';
import useQuizSession from '../hooks/useQuizSession';
import SessionTopBar from '../components/quizSession/SessionTopBar';
import QuestionNavigator from '../components/quizSession/QuestionNavigator';
import QuestionCard from '../components/quizSession/QuestionCard';
import SubmitConfirmModal from '../components/quizSession/SubmitConfirmModal';
import TimeWarningToast from '../components/quizSession/TimeWarningToast';
import WaitingScreen from '../components/quizSession/WaitingScreen';

export default function QuizSession() {
  const session = useQuizSession();
  const {
    roomData, isSolo, answers, answeredCount, totalQuestions,
    globalTimeLeft, isSubmitting,
    showConfirmModal, setShowConfirmModal,
    showWarningToast,
    activeIndex, setActiveIndex,
    questionRefs,
    handleSelectAnswer, scrollToQuestion,
    handleSubmitRequest, handleAutoSubmit
  } = session;

  if (!roomData) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-start animate-spin" />
      </div>
    );
  }

  if (!isSolo && roomData.status === 'waiting') return <WaitingScreen />;

  const questions = roomData.questions || [];
  const totalTime = roomData.settings?.globalTimerEnabled
    ? (roomData.settings.globalTimer || 10) * 60
    : null;

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <SessionTopBar
        title={roomData.title}
        globalTimeLeft={globalTimeLeft}
        totalTime={totalTime}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        onSubmit={handleSubmitRequest}
        isSubmitting={isSubmitting}
      />

      {/* Mobile navigator strip */}
      <div className="lg:hidden sticky top-[57px] z-30 bg-dark-bg/95 border-b border-dark-border px-4 py-3">
        <QuestionNavigator
          questions={questions}
          answers={answers}
          activeIndex={activeIndex}
          onJump={scrollToQuestion}
        />
      </div>

      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 py-8 gap-8">
        {/* Desktop sidebar navigator */}
        <aside className="hidden lg:block w-16 shrink-0">
          <div className="sticky top-24">
            <QuestionNavigator
              questions={questions}
              answers={answers}
              activeIndex={activeIndex}
              onJump={scrollToQuestion}
            />
          </div>
        </aside>

        {/* All questions */}
        <main className="flex-1 space-y-6">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id ?? idx}
              question={q}
              questionIndex={idx}
              answer={answers[q.id]}
              onAnswer={(qId, val) => {
                handleSelectAnswer(qId, val);
                setActiveIndex(idx);
              }}
              cardRef={el => { questionRefs.current[idx] = el; }}
            />
          ))}

          <div className="flex justify-end pt-4 pb-8">
            <button
              onClick={handleSubmitRequest}
              disabled={answeredCount === 0 || isSubmitting}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-40"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </main>
      </div>

      <SubmitConfirmModal
        unansweredCount={showConfirmModal ? totalQuestions - answeredCount : null}
        onConfirm={handleAutoSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />

      <TimeWarningToast show={showWarningToast} />
    </div>
  );
}
