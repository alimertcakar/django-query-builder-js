const postfixes = [
  "__exact",
  "__iexact",
  "__contains",
  "__icontains",
  "__in",
  "__startswith",
  "__istartswith",
  "__endswith",
  "__iendswith",
  "__gt",
  "__gte",
  "__lt",
  "__lte",
  "__isnull",
  "__regex",
  "__iregex",
  "__date",
  "__year",
  "__month",
  "__day",
  "__week",
  "__week_day",
  "__hour",
  "__minute",
  "__second",
  "__range",
] as const;
type Postfix = (typeof postfixes)[number];

type ParamFunction<T> = (value?: T) => { [key: string]: T } & {
  [key in Postfix]: (value?: any) => { parse: () => { [key: string]: T } };
};

type Params = {
  [key: string]: ParamFunction<any>;
};

function buildQueryParams(): Params {
  return new Proxy(
    {},
    {
      get: (target, prop: string) => {
        return (value: any) => {
          const _postfixes = Object.fromEntries(
            postfixes.map((postfix) => [
              postfix,
              (postfixValue: any) => ({
                parse: () => {
                  let _postfixValue = postfixValue;
                  if (postfix === "__in" && Array.isArray(postfixValue)) {
                    _postfixValue = postfixValue.join(",");
                  }
                  return { [prop + postfix]: _postfixValue ?? value };
                },
              }),
            ])
          );

          return {
            [prop]: value,
            ..._postfixes,
          };
        };
      },
    }
  ) as Params;
}

console.log(buildQueryParams().status().__in([1, 2, 3, 4]).parse());
console.log(buildQueryParams().name("John").__iexact().parse());
