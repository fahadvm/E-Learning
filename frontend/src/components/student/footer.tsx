import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img src="/assets/img/logo/logo2_footer.png" alt="Footer Logo" className="h-12 mb-6" />
            <p className="text-gray-400 mb-6">
              The automated process starts as soon as your clothes go into the machine.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://bit.ly/sai4ull" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-pinterest-p"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Solutions</h4>
            <ul className="space-y-2">
              {['Design & creatives', 'Telecommunication', 'Restaurant', 'Programing', 'Architecture'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {['Design & creatives', 'Telecommunication', 'Restaurant', 'Programing', 'Architecture'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {['Design & creatives', 'Telecommunication', 'Restaurant', 'Programing', 'Architecture'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-6 text-center">
          <p className="text-gray-400">
            Copyright &copy; {new Date().getFullYear()} All rights reserved | This template is made with{' '}
            <i className="fa fa-heart text-red-500" aria-hidden="true"></i> by{' '}
            <a href="https://colorlib.com" target="_blank" className="text-gray-400 hover:text-white">
              Colorlib
            </a>
          </p>
        </div>
      </div>
      <div className="fixed bottom-4 right-4">
        <a href="#" title="Go to Top" className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600">
          <i className="fas fa-level-up-alt"></i>
        </a>
      </div>
    </footer>
  );
}