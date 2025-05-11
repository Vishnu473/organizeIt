import LandingNavbar from "../components/Navbars/LandingNavbar";

const Landing = () => {

    return (
        <>
            <LandingNavbar />
            <main className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {/* Hero */}
                <section className="text-center px-6 py-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700 dark:text-blue-400">OrganizeIt</h1>
                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                        A flexible, powerful platform to create, customize, and manage everything — your tasks, documents, plans, and more — all in one place.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Try Now</a>
                        <a href="#how-it-works" className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800">See How It Works</a>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-16 px-6 bg-white dark:bg-gray-900">
                    <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {[
                            "Create a custom template — Define the structure you need: tasks, files, dates, notes, anything.",
                            "Store entries your way — Save them on your device or in the cloud with a single click.",
                            "Access & update anytime — View, edit, and track your data easily.",
                            "Share templates with others — Let others use your template without touching your data."
                        ].map((step, i) => (
                            <div key={i} className="p-6 border rounded shadow-sm bg-blue-50 dark:bg-gray-800 dark:border-gray-700">
                                <h3 className="font-semibold mb-2">Step {i + 1}</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{step}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Unique Features */}
                <section id="features" className="py-16 px-6 bg-gray-50 dark:bg-gray-950">
                    <h2 className="text-2xl font-bold text-center mb-8">What Makes OrganizeIt Unique?</h2>
                    <p className="max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        Unlike rigid planners or note apps, OrganizeIt lets you define what you want to organize. Use it for certificates, events, groceries, or even mood journals.
                        Choose local or cloud storage — your data, your way. Share templates with your team or audience with ease.
                    </p>
                </section>

                {/* Story */}
                <section id="story" className="py-16 px-6 bg-white dark:bg-gray-900">
                    <h2 className="text-2xl font-bold text-center mb-6">Our Story</h2>
                    <blockquote className="max-w-2xl mx-auto italic text-gray-600 dark:text-gray-400 text-center">
                        “OrganizeIt was born from a simple need: keeping different parts of life — tasks, ideas, files — in one place, without being forced into someone else’s system.”
                        <br />
                        <span className="block mt-4">— Built in a 72-hour hackathon</span>
                    </blockquote>
                </section>

                {/* Expectations */}
                <section className="py-16 px-6 bg-blue-50 dark:bg-gray-800">
                    <h2 className="text-2xl font-bold text-center mb-8">What Can You Expect?</h2>
                    <ul className="max-w-xl mx-auto list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                        <li>Build unlimited templates</li>
                        <li>Store anything: files, dates, text, links</li>
                        <li>Export data or share with others</li>
                        <li>Responsive UI for desktop, tablet, mobile</li>
                        <li>Choose storage method (local/Supabase)</li>
                        <li>Private by default, shareable by choice</li>
                    </ul>
                </section>

                {/* Footer */}
                <footer id="contact" className="py-10 bg-gray-900 dark:bg-black text-white text-center text-sm">
                    <p className="mb-2">&copy; {new Date().getFullYear()} OrganizeIt</p>
                    <div className="space-x-4">
                        <a href="/privacy" className="hover:underline">Privacy & Data</a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Source</a>
                        <a href="mailto:team@organizeit.com" className="hover:underline">Contact</a>
                    </div>
                    <div className="mt-4 space-x-3">
                        <a href="#" className="inline-block">🌐 Instagram</a>
                        <a href="#" className="inline-block">🌐 Facebook</a>
                    </div>
                </footer>
            </main>
        </>
    );
};

export default Landing;
