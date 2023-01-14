/* eslint-disable no-useless-constructor */
abstract class WebComponent {
  /**
   * Custom square element added to page);
   */
  public abstract connectedCallback(): void;

  /**
   * Custom square element removed from page.
   */
  public abstract disconnectedCallback(): void;

  /**
   * Custom square element moved to new page.
   */
  public abstract adoptedCallback(): void;

  /**
   * Custom square element attributes changed
   */
  public abstract attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
}

export default WebComponent;
