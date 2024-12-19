"use strict";
const postfixes = [
    "__exact",
    "__exact",
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
];
function getParams() {
    return new Proxy({}, {
        get: (target, prop) => {
            return (value) => {
                const postfixFn = (postfix) => ({
                    parse: () => {
                        return { [prop + postfix]: value };
                    },
                });
                const _postfixes = Object.fromEntries(postfixes.map((postfix) => [
                    postfix,
                    (postfixValue) => ({
                        parse: () => {
                            let _postfixValue = postfixValue;
                            if (postfix === "__in" && Array.isArray(postfixValue)) {
                                _postfixValue = postfixValue.join(",");
                            }
                            return { [prop + postfix]: _postfixValue ?? value };
                        },
                    }),
                ]));
                return {
                    [prop]: value,
                    ..._postfixes,
                };
            };
        },
    });
}
console.log(getParams().status().__in([1, 2, 3, 4]).parse());
