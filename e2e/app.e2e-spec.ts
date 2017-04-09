import { BeaconControlWebAdminPage } from './app.po';

describe('beacon-control-web-admin App', function() {
  let page: BeaconControlWebAdminPage;

  beforeEach(() => {
    page = new BeaconControlWebAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
