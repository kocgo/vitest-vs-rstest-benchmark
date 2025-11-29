type GreetingProps = {
  name: string;
  excited?: boolean;
};

export function Greeting({ name, excited = false }: GreetingProps) {
  const suffix = excited ? '!' : '.';
  return (
    <div aria-label="greeting">
      <h1>Hello, {name}{suffix}</h1>
      <p data-testid="greeting-copy">
        This component exists to give both test suites the same UI surface area.
      </p>
    </div>
  );
}
