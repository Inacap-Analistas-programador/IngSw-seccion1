import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HeroImage from '../components/common/HeroImage';

describe('HeroImage', () => {
  const testImageSrc = 'https://example.com/hero.jpg';

  it('should render image with src', () => {
    render(<HeroImage src={testImageSrc} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', testImageSrc);
  });

  it('should render with default alt text', () => {
    render(<HeroImage src={testImageSrc} />);
    const image = screen.getByAltText('Hero Image');
    expect(image).toBeInTheDocument();
  });

  it('should render with custom alt text', () => {
    render(<HeroImage src={testImageSrc} alt="Custom Hero" />);
    const image = screen.getByAltText('Custom Hero');
    expect(image).toBeInTheDocument();
  });

  it('should apply default overlay', () => {
    const { container } = render(<HeroImage src={testImageSrc} />);
    const overlay = container.querySelector('.bg-gradient-to-b');
    expect(overlay).toBeInTheDocument();
  });

  it('should not render overlay when overlay is false', () => {
    const { container } = render(<HeroImage src={testImageSrc} overlay={false} />);
    const overlay = container.querySelector('.bg-gradient-to-b');
    expect(overlay).not.toBeInTheDocument();
  });

  it('should apply custom className to wrapper', () => {
    const { container } = render(<HeroImage src={testImageSrc} className="custom-hero" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-hero');
  });

  it('should have default styling classes', () => {
    const { container } = render(<HeroImage src={testImageSrc} />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('relative', 'w-full', 'overflow-hidden');
  });

  it('should have responsive height classes', () => {
    const { container } = render(<HeroImage src={testImageSrc} />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('h-64', 'md:h-96');
  });

  it('should apply object-cover to image', () => {
    render(<HeroImage src={testImageSrc} />);
    const image = screen.getByRole('img');
    expect(image).toHaveClass('object-cover');
  });

  it('should apply full width and height to image', () => {
    render(<HeroImage src={testImageSrc} />);
    const image = screen.getByRole('img');
    expect(image).toHaveClass('w-full', 'h-full');
  });

  it('should have lazy loading', () => {
    render(<HeroImage src={testImageSrc} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('should render overlay with gradient', () => {
    const { container } = render(<HeroImage src={testImageSrc} />);
    const overlay = container.querySelector('.bg-gradient-to-b');
    expect(overlay).toHaveClass('from-transparent', 'to-black/30');
  });

  it('should position overlay absolutely', () => {
    const { container } = render(<HeroImage src={testImageSrc} />);
    const overlay = container.querySelector('.bg-gradient-to-b');
    expect(overlay).toHaveClass('absolute', 'inset-0');
  });

  it('should combine custom className with defaults', () => {
    const { container } = render(<HeroImage src={testImageSrc} className="extra-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('relative');
    expect(wrapper).toHaveClass('extra-class');
  });

  it('should render complete hero image with all props', () => {
    const { container } = render(
      <HeroImage
        src={testImageSrc}
        alt="Scout Adventure"
        className="hero-custom"
        overlay={true}
      />
    );

    const image = screen.getByAltText('Scout Adventure');
    expect(image).toHaveAttribute('src', testImageSrc);
    expect(container.firstChild).toHaveClass('hero-custom');
    
    const overlay = container.querySelector('.bg-gradient-to-b');
    expect(overlay).toBeInTheDocument();
  });
});
