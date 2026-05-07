import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';

export default function FooterActions({ step, setStep, handleNextStep, handleLaunch, isSubmitting, formError, setFormError }) {
  return (
    <>
      {formError && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm text-center font-medium">
          {formError}
        </div>
      )}
      <div className="flex justify-between items-center border-t border-dark-border pt-6">
        <button 
          onClick={() => { setFormError(''); setStep(step - 1); }}
          disabled={step === 1 || isSubmitting}
          className="btn-secondary flex items-center gap-2 px-6 disabled:opacity-0"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        {step < 3 ? (
          <button 
            onClick={handleNextStep}
            className="btn-primary flex items-center gap-2 px-8"
          >
            Next Step <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button 
            onClick={handleLaunch}
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2 px-8 bg-gradient-to-r from-accent to-emerald-400 hover:shadow-accent/25"
          >
            {isSubmitting ? 'Launching...' : 'Launch Room'} <Rocket className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  );
}
