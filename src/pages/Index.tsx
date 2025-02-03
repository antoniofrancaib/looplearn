const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 text-center mb-6 animate-fade-in">
        Master Your Learning Journey
      </h1>
      <p className="text-xl text-gray-600 text-center max-w-2xl mb-12 animate-fade-in">
        Transform your study experience with our intelligent flashcard system. Learn smarter, not harder.
      </p>
      <a
        href="/dashboard"
        className="inline-flex items-center px-8 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition-colors animate-fade-in"
      >
        Get Started
      </a>
    </div>
  );
};

export default Index;