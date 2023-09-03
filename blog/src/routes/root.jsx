import ButtonModule from 'storefrontApp/Button'
const Button = ButtonModule.default
import { Link } from'react-router-dom'

const Root = ({ children }) => (
  <>
  <header>
    <nav className="">
        <ul>
            <li className="">
                <Link to="/" className="">Home</Link>
            </li>
            <li className="">
                <Link to="/posts" className="">Posts</Link>
            </li>
            <li className="">
                <Link to="/authors" className="">Authors</Link>
            </li>
        </ul>
    </nav>
  </header>
  <main>
    {children}
  </main>
    <div className="mt-10 text-xs mx-auto max-w-6xl">
      <div>Name: blog</div>
      <div>Framework: react</div>
      <div>Language: JavaScript</div>
      <div>CSS: Tailwind</div>
      <Button />
    </div>
  </>
);

export default Root;