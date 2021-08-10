const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const FileProcessor = require('../lib/file-processor-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new FileProcessor.FileProcessorStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
