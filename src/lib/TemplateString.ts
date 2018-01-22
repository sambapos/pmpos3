
export default (function () {
    var cache = {};

    function generateTemplate(template: string) {
        var fn = cache[template];

        if (!fn) {
            // Replace ${expressions} (etc) with ${map.expressions}.

            var sanitized = template
                .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function (_: any, match: any) {
                    return `\$\{map.${match.trim()}\}`;
                })
                // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
                .replace(/(\$\{(?!map\.)[^}]+\})/g, '');

            fn = cache[template] = Function('map', `return \`${sanitized}\``);
        }

        return fn;
    }

    return generateTemplate;
})();