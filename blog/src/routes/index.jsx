import ButtonModule from 'storefrontApp/Button'
const Button = ButtonModule.default

export default function Index() {
    return (
      <>
        <div className="mt-10 text-xs mx-auto max-w-6xl">
        <div>Name: blog</div>
        <div>Framework: react</div>
        <div>Language: JavaScript</div>
        <div>CSS: Tailwind</div>
        <Button />
      </div>
      </>
    );
  }