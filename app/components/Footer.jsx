export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Sai Vishnu Vamsi Senagasetty. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Built with Next.js 14 & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}

