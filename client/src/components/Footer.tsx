import { Link } from "wouter";
import OwlMascot from "./OwlMascot";

export default function Footer() {
  return (
    <footer className="bg-primary py-6 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <OwlMascot size="tiny" />
            <p className="font-bold">LearnSpeakGrow</p>
          </div>
          
          <div className="flex gap-4 mb-4 md:mb-0">
            <Link href="/parent-dashboard">
              <button className="hover:text-accent transition flex flex-col items-center" aria-label="Parent Dashboard">
                <i className="ri-dashboard-line text-xl"></i>
                <span className="text-sm">Parents</span>
              </button>
            </Link>
            <button className="hover:text-accent transition flex flex-col items-center" aria-label="Help">
              <i className="ri-question-line text-xl"></i>
              <span className="text-sm">Help</span>
            </button>
            <button className="hover:text-accent transition flex flex-col items-center" aria-label="Settings">
              <i className="ri-settings-3-line text-xl"></i>
              <span className="text-sm">Settings</span>
            </button>
          </div>
          
          <p className="text-sm opacity-80">© 2023 LearnSpeakGrow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
